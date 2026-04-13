package config

import (
	"math/rand"
	"strings"
	"time"
)

var KeyDict = [10]string{
	"nerisaasdsadnde", "neriaedqwdqsl", "qsdqdqdqs", "nerieqsqsdqdlys", "qdsqsdqsdqsd",
	"neqsdqsqdsrieth", "qsdqsdqsddsq", "qsdqsdqds", "qsdqsdsdq", "asdqdqsddsqdasd",
}

func padWithZeros(s string, length int) string {
	if len(s) >= length {
		return s
	}
	return s + strings.Repeat("0", length-len(s))
}

func init() {
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(KeyDict), func(i, j int) {
		KeyDict[i], KeyDict[j] = KeyDict[j], KeyDict[i]
	})
	for i := range KeyDict {
		KeyDict[i] = padWithZeros(KeyDict[i], 32)
	}
}
