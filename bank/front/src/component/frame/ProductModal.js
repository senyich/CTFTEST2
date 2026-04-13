import {useState} from "react";
import ProductDataModal from "./ProductDataModal";
import CommentsModal from "./CommentsModal";


function ProductModal(props) {
    const {product, userName, closeModal} = props;
    const [commentsOpen, setCommentsOpen] = useState(false);
        
    const openComments = () => setCommentsOpen(true);
    const closeComments = () => setCommentsOpen(false);

    if (!product) return null;

    return (
        <>
        {commentsOpen ? (
            <CommentsModal
                pid={product.id}
                comments={product.comments}
                closeComments={closeComments}
             />
        ) : (
            <ProductDataModal 
                product={product}
                userName={userName}
                closeModal={closeModal}
                openComments={openComments}
             />
        )}
        </>
    );
}

export default ProductModal;
