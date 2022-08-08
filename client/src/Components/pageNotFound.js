import React from 'react';

function pageNotFound() {
    return (
        <div className="row">
            <div className="col-md-12 d-flex flex-column justify-content-center align-items-center" style={{height:"100vh"}}>
                <h1 style={{fontSize:"120px",fontFamily:"sans-serif"}}>404</h1>
                <h4>Sorry page not found</h4>
            </div>
        </div>
    )
}

export default pageNotFound
