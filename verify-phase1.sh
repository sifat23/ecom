#!/usr/bin/env bash
# verify-phase1.sh — Phase 1 auth DoD automated checks
# Run from the repo root:   bash verify-phase1.sh

set -u

BASE="${BASE:-http://localhost:3000/api}"
JAR="$(mktemp)"
PASS=0
FAIL=0

# Unique suffix so the script can be re-run without "email exists" conflicts.
RUN_TAG="$(date +%s)-$$"
ALICE_EMAIL="alice+${RUN_TAG}@test.dev"
BOB_EMAIL="bob+${RUN_TAG}@test.dev"

# ── Colour helpers ───────────────────────────────────────
G=$'\e[32m'; R=$'\e[31m'; Y=$'\e[33m'; C=$'\e[36m'; N=$'\e[0m'
ok()   { PASS=$((PASS+1)); echo "${G}✓${N} $1"; }
bad()  { FAIL=$((FAIL+1)); echo "${R}✗${N} $1"; }
info() { echo "${C}▸${N} $1"; }
hr()   { echo "──────────────────────────────────────────────"; }

# ── jq is required ───────────────────────────────────────
if ! command -v jq >/dev/null 2>&1; then
  echo "${R}jq is required.${N} Install: brew install jq  (or apt-get install jq)"
  exit 1
fi

echo
echo "${Y}Phase 1 — Authentication Verification${N}"
echo "API base: $BASE"
echo

# Fresh cookie jar
rm -f "$JAR"

# ────────────────────────────────────────────────────────
hr; info "1. Register a customer"
RES=$(curl -s -c "$JAR" -X POST "$BASE/auth/register" \
  -H 'Content-Type: application/json' \
  -d "{
    \"email\":\"$ALICE_EMAIL\",
    \"password\":\"Password123\",
    \"firstName\":\"Alice\",
    \"lastName\":\"Tester\",
    \"role\":\"customer\"
  }")

if [ "$(echo "$RES" | jq -r '.success')" = "true" ]; then
  ok "Customer registered (role: $(echo "$RES" | jq -r '.data.user.role'))"
else
  bad "Customer register failed: $(echo "$RES" | jq -c '.error')"
fi

# ────────────────────────────────────────────────────────
hr; info "2. Register a vendor"
RES=$(curl -s -c "$JAR" -X POST "$BASE/auth/register" \
  -H 'Content-Type: application/json' \
  -d "{
    \"email\":\"$BOB_EMAIL\",
    \"password\":\"Password123\",
    \"firstName\":\"Bob\",
    \"lastName\":\"Seller\",
    \"role\":\"vendor\"
  }")

if [ "$(echo "$RES" | jq -r '.data.user.role')" = "vendor" ]; then
  ok "Vendor registered"
else
  bad "Vendor register failed: $(echo "$RES" | jq -c '.error')"
fi

# ────────────────────────────────────────────────────────
hr; info "3. Duplicate email rejected (expect 409 CONFLICT)"
CODE=$(curl -s -o /tmp/r.json -w '%{http_code}' -X POST "$BASE/auth/register" \
  -H 'Content-Type: application/json' \
  -d "{
    \"email\":\"$ALICE_EMAIL\",
    \"password\":\"Password123\",
    \"firstName\":\"A\",\"lastName\":\"B\",\"role\":\"customer\"
  }")

if [ "$CODE" = "409" ]; then
  ok "Duplicate register blocked (409)"
else
  bad "Expected 409, got $CODE"
fi

# ────────────────────────────────────────────────────────
hr; info "4. Login as seeded customer"
RES=$(curl -s -c "$JAR" -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"customer@marketplace.local","password":"Password123!"}')

USER_TOKEN=$(echo "$RES" | jq -r '.data.accessToken // empty')

if [ -n "$USER_TOKEN" ]; then
  ok "User login (token: ${USER_TOKEN:0:20}…)"
else
  bad "User login failed: $(echo "$RES" | jq -c '.error')"
fi

# ────────────────────────────────────────────────────────
hr; info "5. GET /auth/me with user token"
RES=$(curl -s "$BASE/auth/me" -H "Authorization: Bearer $USER_TOKEN")
if [ "$(echo "$RES" | jq -r '.data.user.email')" = "customer@marketplace.local" ]; then
  ok "/auth/me returns the correct user"
else
  bad "/auth/me failed: $(echo "$RES" | jq -c '.error // .')"
fi

# ────────────────────────────────────────────────────────
hr; info "6. Wrong password → 401"
CODE=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"customer@marketplace.local","password":"WRONG"}')
if [ "$CODE" = "401" ]; then ok "Bad password rejected (401)"; else bad "Expected 401, got $CODE"; fi


hr; info "6.1. Silent refresh via cookie"
sleep 1.1        # JWT iat is second-resolution; ensure a fresh token is minted
RES=$(curl -s -b "$JAR" -c "$JAR" -X POST "$BASE/auth/refresh")



# ────────────────────────────────────────────────────────
hr; info "7. Silent refresh via cookie"
RES=$(curl -s -b "$JAR" -c "$JAR" -X POST "$BASE/auth/refresh")
NEW_TOKEN=$(echo "$RES" | jq -r '.data.accessToken // empty')
if [ -n "$NEW_TOKEN" ] && [ "$NEW_TOKEN" != "$USER_TOKEN" ]; then
  ok "Refresh issued a new access token (rotated)"
else
  bad "Refresh failed or token not rotated"
fi

# ────────────────────────────────────────────────────────
hr; info "8. Admin login (separate context)"
RES=$(curl -s -c "$JAR" -X POST "$BASE/admin/auth/login" \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@marketplace.local","password":"Password123!"}')
ADMIN_TOKEN=$(echo "$RES" | jq -r '.data.accessToken // empty')
if [ -n "$ADMIN_TOKEN" ]; then
  ok "Admin login (token: ${ADMIN_TOKEN:0:20}…)"
else
  bad "Admin login failed: $(echo "$RES" | jq -c '.error')"
fi

# ────────────────────────────────────────────────────────
hr; info "9. Admin token REJECTED by user endpoint"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/auth/me" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
if [ "$CODE" = "403" ]; then ok "Admin token blocked from /auth/me (403)"; else bad "Expected 403, got $CODE"; fi

# ────────────────────────────────────────────────────────
hr; info "10. User token REJECTED by admin endpoint"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/admin/auth/me" \
  -H "Authorization: Bearer $USER_TOKEN")
if [ "$CODE" = "403" ]; then ok "User token blocked from /admin/auth/me (403)"; else bad "Expected 403, got $CODE"; fi

# ────────────────────────────────────────────────────────
hr; info "11. Forgot password (sends email to Mailpit)"
RES=$(curl -s -X POST "$BASE/auth/forgot-password" \
  -H 'Content-Type: application/json' \
  -d '{"email":"customer@marketplace.local"}')
if [ "$(echo "$RES" | jq -r '.success')" = "true" ]; then
  ok "Forgot-password accepted (check http://localhost:8025)"
else
  bad "Forgot-password failed"
fi

# ────────────────────────────────────────────────────────
hr; info "12. Logout (clears cookie, revokes refresh token)"
RES=$(curl -s -b "$JAR" -c "$JAR" -X POST "$BASE/auth/logout")
if [ "$(echo "$RES" | jq -r '.success')" = "true" ]; then ok "Logout succeeded"; else bad "Logout failed"; fi

# ────────────────────────────────────────────────────────
hr; info "13. Refresh AFTER logout should fail"
CODE=$(curl -s -o /dev/null -w '%{http_code}' -b "$JAR" -X POST "$BASE/auth/refresh")
if [ "$CODE" = "401" ]; then ok "Refresh correctly rejected after logout (401)"; else bad "Expected 401, got $CODE"; fi

# ────────────────────────────────────────────────────────
echo
echo "${Y}══════════════════════════════════════════════${N}"
echo "  ${G}PASS: $PASS${N}   ${R}FAIL: $FAIL${N}"
echo "${Y}══════════════════════════════════════════════${N}"
echo

rm -f "$JAR" /tmp/r.json

[ "$FAIL" -eq 0 ] || exit 1