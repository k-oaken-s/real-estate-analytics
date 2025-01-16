package logger

import (
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var log *zap.Logger

func Init(debug bool) error {
    var err error
    config := zap.NewProductionConfig()
    
    if debug {
        config.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
    }
    
    log, err = config.Build()
    if err != nil {
        return err
    }
    
    return nil
}

func Info(msg string, fields ...zapcore.Field) {
    log.Info(msg, fields...)
}

func Error(msg string, fields ...zapcore.Field) {
    log.Error(msg, fields...)
}

func Debug(msg string, fields ...zapcore.Field) {
    log.Debug(msg, fields...)
}