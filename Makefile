# 定義變數
WEBPACK := npx webpack

# 預設目標
.PHONY: all
all: build

# 編譯一次
.PHONY: build
build:
	@echo "Running Webpack build..."
	$(WEBPACK)

# 啟用 watch 模式
.PHONY: watch
watch:
	@echo "Starting Webpack in watch mode..."
	$(WEBPACK) --watch

# 清理生成的檔案 (需要在 Webpack 配置中設置 clean 配置)
.PHONY: clean
clean:
	@echo "Cleaning dist folder..."
	rm -rf dist

# 啟動開發伺服器 (需要 Webpack Dev Server)
.PHONY: serve
serve:
	@echo "Starting Webpack Dev Server..."
	$(WEBPACK) serve

# 幫助訊息
.PHONY: help
help:
	@echo "Makefile commands:"
	@echo "  make build   - Run Webpack to build the project"
	@echo "  make watch   - Run Webpack in watch mode"
	@echo "  make clean   - Clean the dist folder"
	@echo "  make serve   - Start Webpack Dev Server"