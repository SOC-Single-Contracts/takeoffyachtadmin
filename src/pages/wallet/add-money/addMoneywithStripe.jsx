
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter, Typography, Button, IconButton, Dialog, DialogHeader, DialogBody, Input } from "@material-tailwind/react";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useWalletContext, WalletProvider } from '../WalletContext';
import { toast } from 'react-toastify';



// // Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51Qqynz034JyWUuZtU4r5JPHb6ZEUrPwXl68SH04V26L1iuNjMUDxlTZUMBxfFjMXDzeBKegnfsGjKESolnRQjyqs00g4TJZwVn');
const BASE_URL = import.meta.env.VITE_API_URL || 'https://api.takeoffyachts.com';


const AddMoneyForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [token, setToken] = useState(null); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const { walletDetails,updateWalletDetails } = useWalletContext();
  const queryString = window.location.search;
  const searchParams = new URLSearchParams(queryString);
  const userId = searchParams.get('userId');


  // console.log("walletDetails",walletDetails,token,session?.user?.token)

  const handleCardChange = (event) => {
    setError(event.error ? event.error.message : null);
    setCardComplete(event.complete);
  };

  const validateForm = () => {
    if (!cardComplete) {
      setError('Please complete card details');
      return false;
    }
    return true;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    

    try {
        const paymentAmount = Number(walletDetails?.topupAmount);

        
        // Create payment method from card details
        const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: elements.getElement(CardElement),
        });
  
        if (paymentMethodError) {
          throw new Error(paymentMethodError.message);
        }
  
      const response = await fetch(`${BASE_URL}/yacht/admin_wallet/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          amount: paymentAmount,
          user_id:userId
        })
      });
  
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || 'Payment processing failed');
        }
  
        // Payment successful
        toast.success('Payment processed successfully!');
        navigate('/users');
  
      }
     catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
      toast.error(error.message || 'Payment processing failed');
    } finally {
      setIsProcessing(false);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

//test
//   useEffect(()=>{
// console.log("token",token)
//   },[token])

  return (
    <form onSubmit={handleSubmit} className='w-full classForAddMoneyForm space-y-6'>
      <div className='bg-white dark:bg-[#24262F] rounded-2xl shadow-md p-6'>
        <div className='flex items-center gap-2 mb-6'>
          <CreditCard className='w-5 h-5' />
          <h2 className='text-xl font-semibold'>Payment Method</h2>
        </div>

         <div className="space-y-2 my-2">
                      <label htmlFor="topupAmount">
                        Top Up Amount <span className="text-red-500">*</span>
                      </label>
                      <Input
                        id="topupAmount"
                        type="number"
                        placeholder="Enter Top Up Amount"
                        required
                        value={walletDetails.topupAmount || ''}
                        onChange={(e) => updateWalletDetails({ topupAmount: e.target.value })}
                      />
                    </div>



        {error && (
          <div className='bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-md mb-4'>
            {error}
          </div>
        )}

        <div className='space-y-4'>
          <div className='border rounded-md p-3'>
            <CardElement 
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <p className='text-[11px] flex items-center gap-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              You are only charged if the owner accepts.
            </p>
            <p className='text-[11px] flex items-center gap-2 bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300 p-1 rounded-md'>
              <CheckCircle className='w-3 h-3 text-green-500' />
              Guaranteed response within 24 hours
            </p>
          </div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            We accept all major credit and debit cards including Visa, Mastercard, and American Express
          </div>
        </div>
      </div>

      <button 
        type='submit'
        disabled={isProcessing || !stripe || !cardComplete || walletDetails?.topupAmount <= 0}
        className='w-full bg-[#BEA355] text-white rounded-full hover:bg-[#A89245] disabled:opacity-50 disabled:cursor-not-allowed h-10'
      >
        {isProcessing ? 'Processing...' : `Confirm Deposit`}
      </button>
    </form>
  );
};

const AddMoney = () => {
  const navigate = useNavigate();
    const { walletDetails } = useWalletContext();

  return (
    <div className='mx-auto py-10 mt-7 w-full max-w-3xl mx-auto container my-2 flex flex-column justify-between  flex-col items-start gap-8 px-2 px-4 lg:px-6'>
         {/* <div className="flex items-center">
          <button
            onClick={() => navigate("/dashboard/wallet")}
            className="bg-[#F8F8F8] hover:bg-[#F8F8F8] shadow-md rounded-full flex items-center justify-center w-10 h-10"
          >
            <ArrowLeft className="w-4 h-4 text-black" />
          </button>
          <h1 className="text-sm md:text-lg mx-3 font-medium">My Wallet/Add Money</h1>

        </div> */}
      
      <div className='w-full max-w-3xl mx-auto'>
        <Elements stripe={stripePromise}>
          <AddMoneyForm />
        </Elements>
      </div>
    </div>
  );
};

const AddMoneyWizard = () => {
  return (
    <WalletProvider>
      <AddMoney />
      {/* "Add Money" */}
    </WalletProvider>
  );
};

export default AddMoneyWizard;