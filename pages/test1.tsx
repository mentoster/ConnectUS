import type { NextPage } from 'next'
import Script from 'next/script'
const Test: NextPage = () => {
    return (
        <>
            <meta charSet="UTF-8" />
            <title>Agora Video Web SDK Quickstart</title>
            {/*
  This line is used to refer to the bundle.js file packaged by webpack. A sample webpack configuration is shown in the later step of running your app.
  */}
            <Script src="./dist/bundle.js"></Script >
            <h2 className="left-align">Agora Video Web SDK Quickstart</h2>
            <div className="row">
                <div>
                    <button type="button" id="join">
                        JOIN
                    </button>
                    <button type="button" id="leave">
                        LEAVE
                    </button>
                </div>
            </div>
        </>

    )
}

export default Test
