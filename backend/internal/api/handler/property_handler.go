package handler

import (
	"net/http"
	"real-estate-analytics/internal/service"

	"github.com/gin-gonic/gin"
)

type PropertyHandler struct {
    propertyService *service.PropertyService
}

func NewPropertyHandler(propertyService *service.PropertyService) *PropertyHandler {
    return &PropertyHandler{
        propertyService: propertyService,
    }
}

func (h *PropertyHandler) FetchTransactions(c *gin.Context) {
    prefecture := c.Query("prefecture")
    city := c.Query("city")

    if prefecture == "" || city == "" {
        c.JSON(http.StatusBadRequest, gin.H{"error": "prefecture and city are required"})
        return
    }

    if err := h.propertyService.FetchAndStoreTransactions(c, prefecture, city); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "transactions fetched successfully"})
}