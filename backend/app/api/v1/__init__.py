from fastapi import APIRouter
from app.api.v1 import products, click, sellers

router = APIRouter()

router.include_router(products.router, prefix="/products", tags=["Ürünler"])
router.include_router(click.router, prefix="/click", tags=["Tıklama Takibi"])
router.include_router(sellers.router, prefix="/seller", tags=["Mağaza Paneli"])

# Search ayrı prefix ile
from app.api.v1.products import router as products_router
router.include_router(products_router, prefix="", tags=["Arama"])


@router.get("/ping")
async def ping():
    return {"message": "pong", "version": "v1"}
