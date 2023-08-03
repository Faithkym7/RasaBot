import React from "react";
import './message.css';
function Message(){
    return(
        <div className="Message">
            <div className="Message-header">
                <form>
                    <output
                    className='Output'
                    type = "text"
                    >Hi, my name is Shani. How may I help you?</output>
                </form>
            </div>
                
        </div>
    );
}

export default Message;