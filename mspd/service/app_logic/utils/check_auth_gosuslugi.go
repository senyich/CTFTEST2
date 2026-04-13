package utils

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"net/http"
	"regexp"
	"sibir2025/service/config"
)

func CheckAuthKey(auth_key string, username string, r *http.Request) (err error) {
	if len(auth_key) != 108 {
		return errors.New("auth key is too short")
	}
	ending := auth_key[len(auth_key)-32:]
	mac := hmac.New(sha256.New, []byte(config.KeyDict[0]))
	mac.Write([]byte(username))
	expectedMAC := hex.EncodeToString(mac.Sum(nil))
	if subtle.ConstantTimeCompare([]byte(ending), []byte(expectedMAC)) != 1 {
		return errors.New("failed to check auth key")
	}
	re := regexp.MustCompile(`^NXvP\d{3}[a-zA-Z]{2}-\d{6}#([a-zA-Z]{6})-(?:([A-Z][a-z]){3})-(\d{10})@(\d+)#\?{3}[a-zA-Z0-9]{32}$`)
	if re.MatchString(auth_key) {
		return nil
	}
	return errors.New("failed to check auth key")
}
