package utils

import (
	"archive/zip"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"sibir2025/service/app_logic/models"
	"strconv"
	"strings"
)

func CreateSusProfile(w http.ResponseWriter, r *http.Request, susID int, req string, ext string, sus models.Suspect, user models.User) {
	w.Header().Set("Content-Disposition", "attachment; filename=sus"+strconv.Itoa(susID)+".zip")
	w.Header().Set("Content-Type", "application/zip")
	zipWriter := zip.NewWriter(w)
	defer zipWriter.Close()
	imgID := filepath.Clean(req)
	if strings.HasPrefix(imgID, "..") || filepath.IsAbs(imgID) {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	imagePath := filepath.Join("static/sus", imgID+ext)
	cleanPath := filepath.Clean(imagePath)
	if !strings.HasPrefix(cleanPath, "static/sus/") {
		http.Error(w, "Invalid path", http.StatusBadRequest)
		return
	}
	imageFile, err := os.Open(cleanPath)
	if err != nil {
		var e error
		imageFile, e = os.Open("static/unknownsus.png")
		if e != nil {
			http.Error(w, "Epic fail", http.StatusInternalServerError)
			return
		}
	}
	defer imageFile.Close()
	imageZipFile, err := zipWriter.Create("sus" + strconv.Itoa(susID) + ext)
	if err != nil {
		http.Error(w, "Failed to create zip entry for image", http.StatusInternalServerError)
		return
	}
	if _, err := io.Copy(imageZipFile, imageFile); err != nil {
		http.Error(w, "Failed to write image to zip", http.StatusInternalServerError)
		return
	}
	textContent := fmt.Sprintf("	/// MSPD REPORT ///\n* MegaSibirsk Police Department *\n	Подозреваемый №%d\n	Имя: %s\n	Описание: %s\n	Подозревается в: %s\n	Заявка создана пользователем №%d\n	Досье сгенерировано для пользователя %s",
		sus.ID, sus.SusName, sus.SusDesc, sus.CrimeDesc, sus.AuthorID, user.Username)
	textZipFile, err := zipWriter.Create("sus" + strconv.Itoa(susID) + ".txt")
	if err != nil {
		http.Error(w, "Failed to create zip entry for text file", http.StatusInternalServerError)
		return
	}
	if _, err := textZipFile.Write([]byte(textContent)); err != nil {
		http.Error(w, "Failed to write text to zip", http.StatusInternalServerError)
		return
	}
}
