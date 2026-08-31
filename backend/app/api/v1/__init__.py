from fastapi import APIRouter

router = APIRouter()

# İlerde her modül buraya eklenir:
# from app.api.v1 import products, search, click, sellers
# router.include_router(products.router, prefix="/products", tags=["products"])
# ...

@router.get("/ping")
async def ping():
    return {"message": "pong"}
