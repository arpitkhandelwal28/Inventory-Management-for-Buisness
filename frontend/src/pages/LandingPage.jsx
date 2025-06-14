import React, { useRef, useState } from "react"; 
import LoginPage from "./LoginPage"; 

const Navbar = ({ scrollToSection, onLoginClick }) => {
    return (
        <nav className="bg-black text-white p-4 flex justify-between items-center font-outfit">
            <div className="flex items-center">
                <button className="text-white text-2xl mr-4 h-9 w-9">
                    <img src="/src/assets/logo.jpg" className="h-5" alt="Menu" />
                </button>
                <span className="text-lg font-semibold">DistribuHub</span>
            </div>
            <div className="hidden md:flex space-x-8">
                <a href="#" className="hover:text-gray-400 font-extralight" onClick={() => scrollToSection('aboutUs')}>About Us</a>
                <a href="#" className="hover:text-gray-400 font-extralight" onClick={() => scrollToSection('categories')}>Categories</a>
            </div>
            <button
                className="bg-white text-black px-5 py-1.5 rounded-2xl font-extralight cursor-pointer"
                onClick={onLoginClick} 
            >
                Sign In
            </button>
        </nav>
    );
};

const Hero = () => {
    return (
        <section className="bg-white text-black p-8 md:p-16 ">
            <div className="bg-black text-white p-8 md:p-28 rounded-4xl flex">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">Buy your dream plants</h1>
                    <p className="text-lg md:text-xl mb-8">50+ Plant Species | 100+ Customers</p>
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            className="w-full p-4 rounded-full text-black bg-white border-white"
                            placeholder="What are you looking for?"
                        />
                        <button className="absolute flex right-1 top-1 mt-2 mr-2 bg-white items-end text-white p-4 rounded-full bg-[url('/src/assets/search.png')] hover:bg-white hover:text-black transition duration-300">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div className="mt-8">
                    <img
                        src="/src/assets/img1.jpg"
                        className="relative mx-32 scale-150 bottom-10"
                        width="300"
                        height="500"
                        alt="Plants"
                    />
                </div>
            </div>
        </section>
    );
};

const BestSelling = () => {
    const products = [
        { name: "Natural Plants", price: "₹ 1,400.00", img: "/src/assets/img2.jpg" },
        { name: "Artificial Plants", price: "₹ 900.00", img: "/src/assets/img3.jpg" },
        { name: "Decorative Artificial Plants", price: "₹ 3,500.00", img: "/src/assets/img4.jpg" },
    ];

    return (
        <section className="p-8 md:p-16 flex">
            <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4">Best Selling Plants</h2>
                <p className="text-lg mb-8">Easiest way to a healthy life by buying <br />
                    your favorite plants</p>
                <button className="bg-black border-black border-2 text-white px-8 py-4 rounded-full hover:bg-white hover:text-black transition duration-300">See more</button>
            </div>
            <div className="scale-105">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {products.map((product, index) => (
                        <div key={index} className="text-left mx-6">
                            <img src={product.img} alt={product.name} className="mx-auto mb-4 rounded-lg hover:opacity-80 transition duration-300" width="400" height="300" />
                            <h3 className="text-xl font-bold">{product.name}</h3>
                            <p className="text-gray-400 font-bold">{product.price}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const AboutUs = React.forwardRef((props, ref) => {
    const features = [
        {
            icon: "fas fa-seedling",
            title: "Large Assortment",
            description: "We offer many different types of products with fewer variations in each category.",
        },
        {
            icon: "fas fa-shipping-fast",
            title: "Fast & Free Shipping",
            description: "4-day or less delivery time, free shipping and an expedited delivery option.",
        },
        {
            icon: "fas fa-phone-alt",
            title: "24/7 Support",
            description: "Answers to any business-related inquiry 24/7 and in real-time.",
        },
    ];

    return (
        <div ref={ref} className="bg-white text-gray-800 py-12 px-4 md:px-0 items-center justify-center my-16">
            <div className="container mx-auto text-center mb-12">
                <h1 className="text-2xl font-bold ">About Us</h1>
                <p className="text-gray-600">Order now and appreciate the beauty of nature</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center items-center px-8">
                {features.map((feature, index) => (
                    <div key={index} className="text-center my-4 py-5">
                        <div className="flex justify-center mb-4">
                            <div className="bg-black rounded-full p-10">
                                <i className={`${feature.icon} text-white text-3xl`}></i>
                            </div>
                        </div>
                        <h2 className="text-lg font-bold">{feature.title}</h2>
                        <p className="text-gray-600">{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
});

const Categories = React.forwardRef((props, ref) => {
    const categories = [
        {
            name: "Natural Plants",
            image: "/src/assets/img5.jpg",
            description: "A collection of small potted plants on a wooden surface.",
        },
        {
            name: "Plant Accessories",
            image: "/src/assets/img6.jpg",
            description: "Horem ipsum dolor sit amet, consectetur adipiscing elit.",
        },
        {
            name: "Artificial Plants",
            image: "/src/assets/img7.jpg",
            description: "A collection of artificial plants in a modern living room.",
        },
    ];

    return (
        <div ref={ref} className="bg-black ">
            <div className="relative  py-10 pt-28 bottom-16 flex flex-col items-center bg-black">
                <h1 className="text-4xl font-bold bg-black text-white ">Categories</h1>
                <p className="text-gray-400 text-lg bg-black">Find what you are looking for</p>
            </div>
            <div className="bg-black text-white min-h-screen flex flex-col items-center">
                <div className="flex flex-wrap justify-center gap-48 px-8">
                    {categories.map((category, index) => (
                        <div key={index} className="bg-black rounded-lg overflow-hidden shadow-lg w-64 scale-125">
                            <img src={category.image} alt={category.name} className="w-full h-96 object-cover rounded-3xl" />
                            <div className="p-4 text-center">
                                <p className="text-white font-semibold">{category.name}</p>
                                <p className="text-gray-500 text-sm">{category.description}</p>
                            </div>
                        </div>
                    ))}
                    <button className="relative bg-white text-black px-8 py-4 rounded-full bottom-28 font-bold border-2 border-white hover:bg-black hover:text-white transition duration-300">Explore</button>
                </div>
            </div>
        </div>
    );
});

const Footer = () => {
    return (
        <div className="relative h-[400px] bg-black">
            <div className="inline-flex flex-col items-center gap-6 absolute top-12 left-24">
                <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-normal text-white text-lg tracking-[0] leading-[normal]">
                        DistribuHub
                    </div>

                    <p className="relative w-[189px] font-medium text-[#ffffff80] text-lg tracking-[0] leading-[normal] py-2.5">
                        We help you find your dream plant
                    </p>
                </div>

                <div className="inline-flex items-center gap-6 relative flex-[0_0_auto]">
                    <button className="relative w-12 h-12 rounded-3xl border border-solid border-[#ffffff80] hover:bg-gray-600 hover:text-black duration-300">
                        <img
                            className="absolute w-5 h-5 top-3.5 left-3.5 "
                            alt="Gg facebook"
                            src="https://c.animaapp.com/bqaaf23R/img/gg-facebook.svg"
                        />
                    </button>

                    <button className="rounded-3xl border border-solid border-[#ffffff80] relative w-12 h-12 hover:bg-gray-600 hover:text-black duration-300">
                        <img
                            className="absolute w-5 h-5 top-[13px] left-[13px]"
                            alt="Ri instagram fill"
                            src="https://c.animaapp.com/bqaaf23R/img/ri-instagram-fill.svg"
                        />
                    </button>

                    <button className="rounded-3xl border border-solid border-[#ffffff80] relative w-12 h-12 hover:bg-gray-600 hover:text-black duration-300">
                        <img
                            className="absolute w-5 h-4 top-[15px] left-[13px]"
                            alt="Vector"
                            src="https://c.animaapp.com/bqaaf23R/img/vector.svg"
                        />
                    </button>
                </div>
            </div>

            <div className="inline-flex items-start gap-12 absolute top-12 left-[892px] py-12">
                <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-bold text-white text-lg tracking-[0] leading-[normal]">
                        Information
                    </div>

                    <button className="relative w-fit font-normal text-[#fffbfb80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">About</button>

                    <button className="relative w-fit font-normal text-[#fff7f780] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Product
                    </button>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Blog
                    </button>
                </div>

                <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-bold text-white text-lg tracking-[0] leading-[normal duration-300]">
                        Company
                    </div>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Community
                    </button>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Career
                    </button>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Our story
                    </button>
                </div>

                <div className="inline-flex flex-col items-start gap-6 relative flex-[0_0_auto]">
                    <div className="relative w-fit mt-[-1.00px] font-bold text-white text-lg tracking-[0] leading-[normal] duration-300">
                        Contact
                    </div>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Getting Started
                    </button>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Pricing
                    </button>

                    <button className="relative w-fit font-normal text-[#ffffff80] text-lg tracking-[0] leading-[normal] hover:text-white duration-300">
                        Resources
                    </button>
                </div>
            </div>

            <p className="absolute top-[324px] left-[97px] font-medium text-[#ffffff80] text-lg tracking-[0] leading-[normal]">
                2023 All Right Reserved Term of use DistribuHub
            </p>
        </div>
    );
};

const Testimonials = () => {
    const testimonials = [
        {
            text: "Great selection of plants and amazing customer service!",
            name: "Alex Johnson",
            role: "Customer",
            image: "/src/assets/pfp2.jpg",
            rating: 5,
        },
        {
            text: "Fast shipping and high-quality plants. Highly recommend!",
            name: "Adam Smith",
            role: "Customer",
            image: "/src/assets/pfp2.jpg",
            rating: 4.5,
        },
    ];

    return (
        <div className="container mx-auto px-10 py-40">
            <h1 className="text-3xl font-bold mb-4 ">
                What customers say about <span className="text-black py-5">DistribuHub?</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-black text-white p-9 py-20 flex flex-col justify-between rounded-4xl">
                        <div className="flex items-center rounded-4xl">
                            <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 object-fill" />
                            <div>
                                <p className="font-bold">{testimonial.name}</p>
                                <p className="text-gray-400 text-sm">{testimonial.role}</p>
                            </div>
                            <div className="ml-auto flex items-center rounded-4xl">
                                <i className="fas fa-star text-yellow-500"></i>
                                <span className="ml-2">{testimonial.rating}</span>
                            </div>
                        </div>
                        <p className="mb-4 py-4 rounded-4xl ">{testimonial.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PlantShop = () => {
    const categoriesRef = useRef(null);
    const aboutUsRef = useRef(null);
    const [showLogin, setShowLogin] = useState(false); // State to control login page visibility

    const scrollToSection = (section) => {
        if (section === 'categories') {
            categoriesRef.current.scrollIntoView({ behavior: "smooth" });
        } else if (section === 'aboutUs') {
            aboutUsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleLoginClick = () => {
        setShowLogin(true); // Show the login page
    };

    return (
        <div className="font-outfit">
            <Navbar scrollToSection={scrollToSection} onLoginClick={handleLoginClick} />
            {showLogin ? (
                <LoginPage /> // Render the LoginPage if showLogin is true
            ) : (
                <>
                    <Hero />
                    <BestSelling />
                    <AboutUs ref={aboutUsRef} />
                    <Categories ref={categoriesRef} />
                    <Testimonials />
                    <Footer />
                </>
            )}
        </div>
    );
};

export default PlantShop;