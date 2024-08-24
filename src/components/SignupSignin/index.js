import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import Button from "../Button";
import { createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    signInWithPopup 
} from "firebase/auth";
import { auth, provider, db } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider } from "firebase/auth/web-extension";

function SignupSigninComponent() {
    const [name, setName] = new useState("");
    const [email, setEmail] = new useState("");
    const [password, setPassword] = new useState("");
    const [confirmPassword, setConfirmPassword] = new useState("");
    const [loginForm, setLoginForm] = new useState(false);
    const [loading, setLoading] = new useState(false);
    const navigate = useNavigate();

    function signupWithEmail() {
        setLoading(true);
        console.log("Name",name);
        console.log("Email",email);
        console.log("Password",password);
        console.log("Confirm Password",confirmPassword);
        // Authenticate the user or create a new account of user
        if(name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
            if(password === confirmPassword) {
                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;
                        console.log("User>>>", user);
                        toast.success("User Created!");
                        setLoading(false);
                        setName("");
                        setEmail("");
                        setPassword("");
                        setConfirmPassword("");
                        createDoc(user);
                        navigate("/dashboard");
                        //Create a doc with user id as the following id
                        // ...
                    })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    toast.error(errorMessage);
                    setLoading(false);
                    // ..
                });
            } else {
                toast.error("Password and Confirm password don't match");
            }
        } else {
            toast.error("All fields are mandatory!");
            setLoading(false);
        }
    }

    function loginUsingEmail() {
        console.log("Email", email);
        console.log("password", password);
        setLoading(true);
        if(email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //Signed in
                    const user = userCredential.user;
                    toast.success("User Logged In!");
                    console.log("User Logged In, user");
                    createDoc(user);
                    setLoading(false);
                    navigate("/dashboard");
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    setLoading(false);
                    toast.error(errorMessage);
                });
        } else {
            toast.error("All Fields are Mandatory!");
            setLoading(false);
        }
    }

    async function createDoc(user) {
        setLoading(true);
        if (!user) return;

        const userRef = doc(db, "users", user.uid);
        const userData = await getDoc(userRef);
        if(!userData.exists()) {
            try {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName ? user.displayName : name,
                    email,
                    photoURL: user.photoURL ? user.photoURL : "",
                    createdAt: new Date(),
                });
                toast.success("Doc Created!");
                setLoading(false);
            } catch(e) {
                toast.error(e.message);
                setLoading(false);
            }
        } else {
            // toast.error("Doc already exists!");
            setLoading(false);
        }  
    }

    function googleAuth() {
        setLoading(true);
        try {
            signInWithPopup(auth, provider) 
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log("user>>>", user);
                createDoc(user);
                setLoading(false);
                navigate("/dashboard");
                toast.success("User Authenticated");
            })
            .catch ((error) => {
                setLoading(false);
                const errorCode = error.code;
                const errorMessage = error.message;
                toast.error(errorMessage);
            });
        } catch(e) {
            setLoading(false);
            toast.error(e.message);
        }    
    }

    return (
        <>
        {loginForm ? (
            <div className="signup-wrapper">
                <h2 className="title">
                    Login on <span className="p-login" style={{ color: "var(--theme)" }}>INEXFI.</span>
                </h2>
                <form>
                    <Input 
                        type="email"
                        label={"Email"} 
                        state={email} 
                        setState={setEmail} 
                        placeholder={"Michealdeo@gmail.com"}
                    />
                    <Input 
                        type="password"
                        label={"Password"} 
                        state={password} 
                        setState={setPassword} 
                        placeholder={"Example@123"}
                    />
                    <Button 
                        disabled={loading}
                        text={loading ? "Loading..." : "Login using Email and Password"} 
                        onClick={loginUsingEmail} 
                    />
                    <p className="p-login" style={{textAlign:"center", margin: 0}}>or</p>
                    <Button 
                        onClick={googleAuth}
                        text={loading ? "Loading..." : "Login using Google"} 
                        blue={true}
                    />
                    <p className="p-login" 
                    style={{ cursor: "pointer" }} 
                    onClick={()=>setLoginForm(!loginForm)}>
                        Or Don't Have An Account? Click Here
                    </p>
                </form>
            </div>
        ) : (
    
    <div className="signup-wrapper">
        <h2 className="title">
            Sign up on <span className="p-login" style={{ color: "var(--theme)" }}>INEXFI.</span>
        </h2>
        <form>
            <Input 
                label={"Full Name"} 
                state={name} 
                setState={setName} 
                placeholder={"Micheal Deo"}
            />
            <Input 
                type="email"
                label={"Email"} 
                state={email} 
                setState={setEmail} 
                placeholder={"Michealdeo@gmail.com"}
            />
            <Input 
                type="password"
                label={"Password"} 
                state={password} 
                setState={setPassword} 
                placeholder={"Example@123"}
            />
            <Input 
                type="password"
                label={"Confirm Password"} 
                state={confirmPassword} 
                setState={setConfirmPassword} 
                placeholder={"Example@123"}
            />
            <Button 
                disabled={loading}
                text={loading ? "Loading..." : "Signup using Email and Password"} 
                onClick={signupWithEmail} 
            />
            <p className="p-login" style={{textAlign:"center", margin: 0}}>or</p>
            <Button 
                onClick={ googleAuth}
                text={loading ? "Loading..." : "Signup with Google"} 
                blue={true}
            />
            <p className="p-login" 
                style={{ cursor: "pointer" }} 
                onClick={()=>setLoginForm(!loginForm)}
            >
                Or Have An Account Already? Click Here
            </p>
        </form>
    </div>
    )}
    </>
    );
}

export default SignupSigninComponent;