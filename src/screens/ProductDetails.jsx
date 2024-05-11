import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { loadStripe } from '@stripe/stripe-js';
import StarRating from '../components/Ratings';
import Header from '../components/Header';
import Loading from '../components/Loading';

const stripePromise = loadStripe('pk_test_51PEvNOEoCKfVp71pGchlLLSILQp5clDkfWmBfoh0mvVdoyBfGM6x6AWyd2EchcTruN343g3RrkhPe4MeyLCsyHPj00KmIPxHxC');

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, 'Products', productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          setProduct({ id: productSnapshot.id, ...productSnapshot.data() });
        } else {
          console.log('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleBuyNowClick = async (e) => {
    e.preventDefault();
    if (!product) return;

    const amount = product.Price * 100;
    const redirectUrl = window.location.href;

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: 'Basic c2tfdGVzdF95MXpTSmdMQ0E2WExKV05XeEpEZkNINlU6',
      },
      body: JSON.stringify({
        productName: product.Name,
        price: amount,
      }),
    };

    try {
      const response = await fetch('http://localhost:4000/create-checkout-session', options);
      if (response.ok) {
        const session = await response.json();
        const stripe = await stripePromise;
        const result = await stripe.redirectToCheckout({ sessionId: session.id });

        if (result.error) {
          console.error('Error during redirection:', result.error.message);
        }
      } else {
        console.error('Error creating checkout session:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!product) {
    return <Loading />;
  }

  return (
    <>
      <Header />
      <div className="wrapper mt-5">
        <div className="select-main">
          <div className="product-details">
            <img className="detail-image" src={product.Image} alt={product.Name} />
          </div>
        </div>
        <div className="select-side">
          <label className="raleway-font font-bold font-logo text-dark">{product.Name}</label>
          <label className="raleway-font font-bold font-small text-dark">{product.Description}</label>
          <label className="raleway-font font-small text-dark">₱{product.Price}</label>
          <label className="raleway-font font-small text-gray">
            <StarRating rating={product.Rating} />
          </label>
          <label className="raleway-font font-small text-gray">{product.Address}</label>
          <form className="mt-5" onSubmit={handleBuyNowClick}>
            <button className="btn-paymongo" type="submit">
              Buy Now
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
