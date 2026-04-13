import {useState, useEffect} from "react";
import {Grid2 as Grid, Drawer} from '@mui/material';

import ProductCard from "../field/ProductCard";
import ProductModal from "../frame/ProductModal";


function HomePage(props) {
    const {products, userData} = props;
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);

    const toggleModal = (state) => () => {
        setModalOpened(state);
    };

    useEffect(() => {
        setSelectedProduct(
        oldProduct => {
            if (oldProduct)
                return products.filter(
                    product => product.id === oldProduct.id
                )[0]}
        );
    }, [products]);

    const pageContent = products.length === 0 ? (
        <Grid 
            container
            alignContent="center"
            justifyContent="center"
            sx={{width: "100%", height: "100%", color: "color.text"}}
        >
            <p>You're late, all the <s>flags</s> products have been bought up :(</p>
        </Grid>
    ) : (
        products.sort((a,b) => a.id - b.id).map(product => (
            <ProductCard
                key={product.id}
                product={product}
                selectProduct={setSelectedProduct}
                openModal={toggleModal(true)}
                ownProduct={product.seller === userData.name}
            />
        ))
    );
    
    return (
        <>
        <Grid
            container
            direction="row"
            justifyContent="flex-start"
            className="PageFrame"
            sx={{bgcolor: "color.secondary"}}
        >   
            {pageContent}
        </Grid>
        <Drawer
            anchor="bottom"
            open={modalOpened}
            onClose={toggleModal(false)}
            PaperProps={{
                sx: {
                    bgcolor: "color.secondary",
                    height: "40vh",
                    maxHeight: "40vh",
                }
            }}
        >
            <ProductModal
                product={selectedProduct}
                closeModal={toggleModal(false)}
                userName={userData.name}
            />
        </Drawer>
        </>
    );
    
}

export default HomePage;