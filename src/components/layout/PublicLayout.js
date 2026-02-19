import Navbar from "./Navbar";
import Footer from "./Footer";

function PublicLayout({ children }) {
    return (
        <>
            <Navbar />
            <main className="container">{children}</main>
            <Footer />
        </>
    );
}

export default PublicLayout;