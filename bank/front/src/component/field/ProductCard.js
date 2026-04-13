import {Grid2 as Grid} from "@mui/material";
import {HOST} from "../../requests";


function ProductCard(props) {
    const {product, selectProduct, openModal, ownProduct} = props;

    const selectProductHandler = () => {
        selectProduct(product);
        openModal();
    };

    return (
        <Grid
            item
            sx={{
                bgcolor: "color.background",
                border: "1px solid",
                borderColor: "color.text",
                borderRadius: "0.375rem",
                padding: "12px",
                margin: "12px",
                width: "200px",
                minWidth: "200px",
                height: "300px",

            }}
            onClick={selectProductHandler}
        >
            <Grid
                container
                direction="column"
                justifyContent="center"
                spacing="12px"
                alignItems="center"
            >
                <Grid item sx={{height: "152px"}}>
                    <img 
                        src={`${HOST}/public/images/${product.image_path}`} 
                        alt={product.imageId} 
                        width={150}
                        style={{borderRadius: "0.375rem"}}
                    />
                </Grid>
                <Grid item className="ProductDescription" sx={{color: "color.text"}}>
                    {product.description}
                </Grid>
                {ownProduct ? (
                    <Grid item sx={{color: "color.accent"}}>
                        <u>Your own</u>
                    </Grid>
                ) : (
                    <Grid item sx={{color: "color.text"}}>
                        {`${product.price}$`}
                    </Grid>
                )}
            </Grid>
        </Grid>
    );
}

export default ProductCard;