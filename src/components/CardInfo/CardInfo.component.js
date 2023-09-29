import React from 'react'


const clickHandler1 = () => {
    window.location.href = 'https://www.instagram.com/sigit_47/';
}

const clickHandler = () => {
    window.location.href = 'mailto:muhammadsigit330@gmail.com';
}

const CardInfo = () => {

    
    return (
        <div class="card">
            <div class="imgBx">

            </div>
            <div class="content">
                <div class="details">
                    <h2>Muhammad Sigit S.Kom<br /><span>Technical Lead</span></h2>
                    <div class="data">
                        <h3>0<br /><span>Posts</span></h3>
                        <h3>0<br /><span>Followers</span></h3>
                        <h3>0<br /><span>Following</span></h3>
                    </div>
                    <div class="actionBtn">
                        <button onClick={clickHandler1}>Follow</button>
                        <button onClick={clickHandler}>Message</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardInfo