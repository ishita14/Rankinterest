import React from 'react'
import './greed.css'
function greed({ post }) {
    // console.log(post);
    return (
        <div className="greed">
            <div class="container">

                <div class="gallery">
                    {
                        post ?
                            <div>
                                {post.map((post) => {
                                    return (
                                        <div class="gallery-item" tabindex="0">

                                            <img className="gallery-image-me" src={post.image} alt=""></img>

                                            <div class="gallery-item-info">

                                                <ul>
                                                    <li class="gallery-item-likes"><span class="visually-hidden">Likes:</span><i class="fas fa-heart" aria-hidden="true"></i> {post.like[0]?.count}</li>

                                                </ul>

                                            </div>

                                        </div>)
                                })}
                            </div>

                            : <h1>loading...</h1>

                    }

                </div>
                {/* <!-- End of gallery --> */}

                {/* <div class="loader"></div> */}

            </div>

        </div>
    )
}

export default greed
