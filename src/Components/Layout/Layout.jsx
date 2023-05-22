import Navigation from './Navigation'
import Footer from './Footer'

const Layout = ({ children, currentUser }) => {
    return (
        <>
            <Navigation currentUser ={currentUser }/>
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout