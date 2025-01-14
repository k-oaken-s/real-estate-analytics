FROM golang:1.21.5-alpine

WORKDIR /app

# ビルド用の依存パッケージをインストール
RUN apk add --no-cache gcc musl-dev

# 依存関係のコピーとダウンロード
COPY go.mod go.sum ./
RUN GOTOOLCHAIN=local go mod download

# ソースコードのコピー
COPY . .

# アプリケーションのビルド
RUN GOTOOLCHAIN=local go build -o /app/main cmd/api/main.go

# 実行権限を付与
RUN chmod +x /app/main

# 実行
ENTRYPOINT ["/app/main"]