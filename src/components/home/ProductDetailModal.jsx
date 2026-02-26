import { useEffect, useState } from "react";
import { Modal, Button, Spinner, Badge } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../reduxStore/cartSlice";
import { toast } from "react-toastify";

const BASE_URL = import.meta.env.VITE_USER_FIREBASE_BASE_URL;

const ProductDetailsModal = ({ productId, show, onHide }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId || !show) return;
    setProduct(null);
    setLoading(true);

    fetch(`${BASE_URL}/products/${productId}.json`)
      .then((r) => r.json())
      .then((data) => setProduct(data))
      .catch(() => toast.error("Failed to load product details."))
      .finally(() => setLoading(false));
  }, [productId, show]);

  const handleAdd = () => {
    if (!product) return;
    const existing = cartItems.find((i) => i.id === productId);
    if (existing && existing.cartQuantity >= product.quantity) {
      toast.warning(`Only ${product.quantity} available in stock`);
      return;
    }
    dispatch(
      addToCart({
        id: productId,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.quantity,
      })
    );
    toast.success(`${product.name} added to cart 🛒`);
  };

  const isOutOfStock = product?.quantity <= 0;

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="product-detail-modal">
      <Modal.Header closeButton className="border-0 pb-0" />

      <Modal.Body className="p-0">
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "420px" }}>
            <Spinner animation="border" variant="secondary" />
          </div>
        )}

        {!loading && product && (
          <div className="d-flex flex-column flex-md-row" style={{ minHeight: "420px" }}>

            <div className="product-modal-image-wrap">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-modal-image"
                onError={(e) => { e.target.src = "https://placehold.co/600x500?text=No+Image"; }}
              />
              {isOutOfStock && (
                <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2">
                  Out of Stock
                </Badge>
              )}
            </div>


            <div className="product-modal-info d-flex flex-column justify-content-between">
              <div>
                <p className="product-modal-category text-uppercase text-muted mb-1" style={{ fontSize: "0.75rem", letterSpacing: "0.1em" }}>
                  {product.category?.replace(/-/g, " ")}
                </p>

                <h2 className="product-modal-name">{product.name}</h2>

                <div className="d-flex align-items-center gap-2 mb-3">
                  <span className="product-modal-price">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                  {!isOutOfStock && (
                    <span className="text-success" style={{ fontSize: "0.85rem" }}>
                      ✓ {product.quantity} in stock
                    </span>
                  )}
                </div>

                <div className="product-modal-divider" />

                <div
                  className="product-modal-description"
                  style={{ maxHeight: "180px", overflowY: "auto" }}
                >
                  {product.description || "No description available."}
                </div>
              </div>

              <div className="mt-4 d-flex gap-3">
                <Button
                  variant={isOutOfStock ? "secondary" : "dark"}
                  className="flex-grow-1 fw-semibold py-2"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </Button>
                <Button variant="outline-secondary" className="py-2 px-3" onClick={onHide}>
                  Close
                </Button>
              </div>
            </div>

          </div>
        )}

        {!loading && !product && (
          <div className="text-center py-5 text-muted">Product not found.</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductDetailsModal;