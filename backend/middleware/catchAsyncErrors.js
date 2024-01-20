module.exports = (theFunc) => (req, res, next) => {
    try {
        Promise.resolve(theFunc(req, res, next)).catch(next);
    } catch (error) {
        next(error);
    }
};
