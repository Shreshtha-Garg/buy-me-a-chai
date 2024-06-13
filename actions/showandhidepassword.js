import { useState } from "react";

function ShowAndHidePassword(){

    const [passwordType, setPasswordType] = useState("password");
    const [password, setPassword] = useState("");
    const handlePasswordChange =(evnt)=>{
        setPassword(evnt.target.value);
    }
    const togglePassword =()=>{
      if(passwordType==="password")
      {
       setPasswordType("text")
       return;
      }
      setPasswordType("password")
    }
    return(

        <div className="row">
            <div className="col-sm-3">
                <div className="input-group my-4 mx-4">
                    <input type={passwordType} onChange={handlePasswordChange} value={password} name="password" class="form-control" placeholder="Password" />
                    <div className="input-group-btn">
                     <button className="btn btn-outline-primary" onClick={togglePassword}>
                     { passwordType==="password"? <i className="bi bi-eye-slash"></i> :<i className="bi bi-eye"></i> }
                     </button>
                    </div>
                </div>
                
            </div>
      </div>
      
    )

}
export default ShowAndHidePassword;