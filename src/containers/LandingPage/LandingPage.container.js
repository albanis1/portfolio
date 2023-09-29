import React from 'react'
import classes from './LadingPage.style.css'
import TypingEffect from '../../components/General/TypingEffect.component'
import CardInfo from '../../components/CardInfo/CardInfo.component'
import ProgressComponent from '../../components/ProgressComponent/ProgressComponent.component'

const LandingPage = () => {
    return (
        <>
            <div class="hero-img"></div>
            <div class="wrapper">
                <section class="hero">
                    <h1>Try to Become Better Every Days!</h1>
                    <div>
                        <h2>My Routine.</h2>
                        <TypingEffect />
                    </div>


                    <h2 class="subhead">My Life Journey.</h2>

                    <svg class="down-arrow" viewBox="0 0 16 132" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.29289 131.707C7.68341 132.098 8.31658 132.098 8.7071 131.707L15.0711 125.343C15.4616 124.953 15.4616 124.319 15.0711 123.929C14.6805 123.538 14.0474 123.538 13.6568 123.929L7.99999 129.586L2.34314 123.929C1.95262 123.538 1.31945 123.538 0.928927 123.929C0.538402 124.319 0.538402 124.953 0.928927 125.343L7.29289 131.707ZM7 -4.37114e-08L6.99999 131L8.99999 131L9 4.37114e-08L7 -4.37114e-08Z" fill="black" />
                    </svg>
                </section>
                <section style={{ height: '1000px' }}>
                    <h1 style={{ marginTop: '25rem' }}>My Achievement.</h1>
                    <div style={{ display: 'flex', marginTop: '10rem' }}>

                        <div style={{marginRight: '15rem', marginTop: '3rem'}}>
                            <CardInfo />
                        </div>
                        <div style={{marginLeft: 'auto'}}>
                        <ProgressComponent/>

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default LandingPage