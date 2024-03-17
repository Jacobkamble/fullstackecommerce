const sentToken = (user, statusCode, res) => {
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true, // Cookie will only be sent over HTTPS
        sameSite: 'lax'
    }

    const token = user.getJWTToken();

    // console.log(token, "token")


    // console.log(res.cookie("mycookie", "dgdgggsff"))

    // localStorage.setItem("token32", token)
    res.status(statusCode).cookie("token", token, options).json({
        success: true,
        token,
        user
    })

}

module.exports = sentToken;