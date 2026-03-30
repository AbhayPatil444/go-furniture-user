import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import ProductCard from "../components/home/ProductCard";

const SearchResultsPage = () => {
    const BASE_URL = import.meta.env.VITE_USER_FIREBASE_BASE_URL;
    const { search } = useLocation();
    const query = new URLSearchParams(search).get("query")?.toLowerCase();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const fetchData = async () => {
            const res = await fetch(`${BASE_URL}/products.json`);
            const data = await res.json();

            if (!data) {
                setProducts([]);
                setLoading(false);
                return;
            }

            const all = Object.entries(data).map(([id, p]) => ({ id, ...p }));

            const filtered = all.filter((p) =>
                p.name.toLowerCase().includes(query) ||
                p.category?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query)
            );

            setProducts(filtered);
            setLoading(false);
        };

        fetchData();
    }, [query]);

    return (
        <Container className="my-4">
            <h3 className="mb-4">
                Search results for: "<span className="text-primary">{query}</span>"
            </h3>

            {loading ? (
                <div className="text-center py-5">
                    <Spinner animation="border" />
                </div>
            ) : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <Row>
                    {products.map((product) => (
                        <Col md={3} sm={6} xs={12} className="mb-4" key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default SearchResultsPage;