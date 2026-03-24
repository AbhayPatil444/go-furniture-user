import { useEffect, useState } from "react";
import { Container, Spinner, Button } from "react-bootstrap";
import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ProductSection = ({title, category, BASE_URL}) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/products.json`);
                const data = await res.json();
                if (data) {
                    const list = Object.entries(data)
                        .map(([id, prod]) => ({ id, ...prod }))
                        .filter((p) => p.category === category);
                    setProducts(list);
                }
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryProducts();
    }, [category, BASE_URL]);
    return (<>
        <Container className="my-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="product-section-title mb-0">{title}</h3>
                <Button 
                    variant="link" 
                    onClick={() => navigate(`/category/${category}`)} 
                    className="text-decoration-none">
                    View All →
                </Button>
            </div>  
            <div className="position-relative">
            <Swiper
                spaceBetween={16}
                slidesPerView="auto"
                grabCursor={true}
                style={{ paddingBottom: "20px" }}
            >
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" />
                    </div>
                ) : (products.length > 0 ? (
                        products.map((product) => (
                            <SwiperSlide key={product.id} style={{ width: "250px" }}>
                                <ProductCard product={product} />
                            </SwiperSlide>
                        ))
                    ) : (<p>No products found for {title}</p>)
                )}
            </Swiper>
            </div>
        </Container>
    </>)
}

export default ProductSection;