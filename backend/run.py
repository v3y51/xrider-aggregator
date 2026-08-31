import os
import uvicorn

if __name__ == "__main__":
    port = int(os.getenv("PORT", 10000))
    print(f"Starting XRider Backend on 0.0.0.0:{port}...")
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, log_level="info")
