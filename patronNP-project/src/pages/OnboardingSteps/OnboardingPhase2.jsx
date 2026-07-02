import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../hooks/useLanguage";
import { API_HOST } from "../../utils/apiHost";

const SupportForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [provider, setProvider] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = `${API_HOST}/api/payment`;


  // Redirect if already verified
  useEffect(() => {

    const verified = localStorage.getItem("paymentVerified");
    const username = localStorage.getItem("username");

    if (verified === "true" && username) {
      navigate(`/${username}`, {
        replace: true,
      });
    }

  }, [navigate]);



  // Send OTP
  const handlePhoneSubmit = async () => {

    if (!provider) {
      setError(t('payment.selectProvider'));
      return;
    }


    if (phoneNumber.length !== 10) {
      setError(t('payment.validPhoneNumber'));
      return;
    }


    const token = localStorage.getItem("accessToken");


    if (!token) {
      setError(t('payment.pleaseLoginFirst'));
      return;
    }


    setLoading(true);
    setError("");


    try {

      const response = await fetch(
        `${API_BASE}/send-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            phoneNumber,
            provider,
          }),
        }
      );


      const message = await response.text();


      if (!response.ok) {
        throw new Error(message);
      }


      toast.success(message);

      setStep("otp");


    } catch (err) {

      console.error(err);

      setError(
        err.message || t('payment.failedToSendOtp')
      );

    } finally {

      setLoading(false);

    }

  };





  // Verify OTP
  const handleOtpVerify = async () => {


    if (otp.length !== 6) {

      setError(t('payment.otpMustBe6Digits'));

      return;
    }



    const token = localStorage.getItem("accessToken");


    if (!token) {

      setError(t('payment.pleaseLoginFirst'));

      return;

    }



    setLoading(true);
    setError("");



    try {


      const response = await fetch(
        `${API_BASE}/verify-otp`,
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`,

          },


          body: JSON.stringify({

            phoneNumber,

            otp,

          }),

        }
      );



      const data = await response.json();



      if (!response.ok) {

        throw new Error(
          data.message || t('payment.otpVerificationFailed')
        );

      }



      // Save verification status

      localStorage.setItem(
        "paymentVerified",
        "true"
      );


      localStorage.setItem(
        "username",
        data.username
      );



      toast.success(
        data.message
      );



      navigate(
        `/${data.username}`,
        {
          replace:true
        }
      );



    } catch(err) {


      console.error(err);


      setError(
        err.message || t('payment.verificationFailed')
      );


    } finally {


      setLoading(false);


    }

  };





  return (

    <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">


      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-green-100 p-8">


        <div className="flex flex-col items-center mb-8">


          <img

            src="/android-chrome-192x192.png"

            alt="PatronNP"

            className="w-16 h-16 rounded-2xl shadow-md mb-4"

          />


          <h2 className="text-2xl font-bold text-gray-800">

            {t('payment.paymentVerificationTitle')}

          </h2>



          <p className="text-gray-500 text-sm">

            {
              step === "phone"
              ? t('payment.linkPaymentAccount')
              : t('auth.verifyOtpTitle')
            }

          </p>


        </div>




        {
          error && (

            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

              {error}

            </div>

          )
        }





        {
          step === "phone" ? (


            <div className="space-y-6">


              <div className="grid grid-cols-3 gap-2">


                {
                  ["ESEWA","BOTH","KHALTI"]
                  .map((item)=>(


                    <button

                      key={item}

                      onClick={()=>setProvider(item)}

                      className={

                        `py-3 rounded-xl border-2 font-bold ${
                          
                          provider===item

                          ? "bg-green-600 text-white border-green-600"

                          : "border-gray-200 text-gray-600"

                        }`

                      }

                    >

                      {item}

                    </button>


                  ))
                }


              </div>





              {
                provider && (

                  <>


                  <input

                    type="tel"

                    value={phoneNumber}

                    onChange={(e)=>

                      setPhoneNumber(

                        e.target.value
                        .replace(/\D/g,"")
                        .slice(0,10)

                      )

                    }


                    placeholder="98XXXXXXXX"

                    className="w-full p-4 rounded-xl border"

                  />



                  <button

                    onClick={handlePhoneSubmit}

                    disabled={loading}

                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"

                  >

                    {
                      loading
                      ? t('auth.sendingOtp')
                      : t('payment.sendOtp')
                    }

                  </button>


                  </>

                )
              }



            </div>



          )



          :



          (



          <div className="space-y-4">


            <p className="text-center text-sm">

              {t('payment.otpSentToPhone')} <b>{phoneNumber}</b>

            </p>



            <input

              value={otp}

              maxLength={6}

              onChange={(e)=>

                setOtp(
                  e.target.value.replace(/\D/g,"")
                )

              }


              placeholder="000000"


              className="w-full p-4 text-center text-2xl tracking-widest border rounded-xl"

            />




            <button

              onClick={handleOtpVerify}

              disabled={loading}

              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"

            >

              {
                loading
                ? t('auth.verifying')
                : t('auth.verifyOtpTitle')
              }


            </button>



            <button

              onClick={()=>{

                setStep("phone");

                setOtp("");

                setError("");

              }}

              className="w-full text-gray-500"

            >

              {t('payment.changeNumber')}

            </button>



          </div>


          )

        }



      </div>


    </div>

  );

};


export default SupportForm;