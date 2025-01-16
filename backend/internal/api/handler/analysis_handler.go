package handler

import (
	"math"
	"net/http"
	"real-estate-analytics/internal/service"

	"github.com/gin-gonic/gin"
)

type AnalysisHandler struct {
    analysisService *service.AnalysisService
}

func NewAnalysisHandler(analysisService *service.AnalysisService) *AnalysisHandler {
    return &AnalysisHandler{
        analysisService: analysisService,
    }
}

func (h *AnalysisHandler) GetAreaAnalysis(c *gin.Context) {
    prefecture := c.Query("prefecture")
    city := c.Query("city")

    if prefecture == "" || city == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "prefecture and city are required"})
        return
    }

    analysis, err := h.analysisService.AnalyzeAreaPrices(c, prefecture, city)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    if math.IsNaN(analysis.CurrentPrice) {
        analysis.CurrentPrice = 0
    }
    if math.IsNaN(analysis.PredictedPrice) {
        analysis.PredictedPrice = 0
    }
    if math.IsNaN(analysis.Confidence) {
        analysis.Confidence = 0
    }

    c.JSON(http.StatusOK, analysis)
}