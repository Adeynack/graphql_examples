package model

import (
	"fmt"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func InitializeDB() *gorm.DB {
	pgHost := env("PGHOST")
	pgUser := env("PGUSER")
	pgDatabaseName := env("PGDB", "go_development")
	pgPort := env("PGPORT")

	dsn := fmt.Sprintf("host=%s user=%s dbname=%s port=%s sslmode=disable", pgHost, pgUser, pgDatabaseName, pgPort)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic(fmt.Errorf("error opening Gorm connection: %v", err))
	}

	err = db.AutoMigrate(
		&User{},
		&Post{},
		&Reaction{},
	)
	if err != nil {
		panic(fmt.Errorf("error auto-migrating database: %v", err))
	}

	return db
}

func env(envName string, defaultValue ...string) string {
	value := os.Getenv(envName)
	if value == "" {
		if len(defaultValue) == 0 {
			panic(fmt.Sprintf("environment %s must be set", envName))
		}
		return defaultValue[0]
	}
	return value
}
