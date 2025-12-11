import { useNavigate } from 'react-router-dom';

import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import BestSellingProduct from '../../component/customer/best-seller';
import Explore from '../../component/customer/explore';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-background-dark font-display text-text-color">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />

          <main className="flex-1 mt-10">
            <section className="px-4 md:px-10 lg:px-40 py-5">
              <div className="@container">
                <div className="@[480px]">
                  <div
                    className="flex min-h-[880px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center"
                    style={{
                      backgroundImage:
                        `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), 
                        url("https://cdn.pixabay.com/photo/2017/10/28/06/48/cow-2896329_1280.jpg")`,
                    }}
                  >
                    <div className="flex flex-col gap-2 text-center">
                      <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl">
                        Fresh Milk
                      </h1>
                      <h2 className="text-white text-lg @[480px]:text-xl">
                        Ghé thăm cửa hàng của chúng tôi
                      </h2>
                    </div>

                    <button
                      onClick={() => navigate('/products')}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 @[480px]:h-14 @[480px]:px-6 bg-secondary text-white text-base font-bold hover:bg-opacity-90 transition-opacity"
                    >
                      <span className="truncate">Mua ngay</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="px-4 md:px-10 lg:px-40 py-10">
              <h2 className="text-text-color text-3xl font-bold text-center px-4 pb-5 pt-5">
                Khám phá nhiều thể loại sản phẩm
              </h2>
              <Explore />
            </section>

            <section className="px-4 md:px-10 lg:px-40 py-10">
              <h2 className="text-text-color text-3xl font-bold text-center px-4 pb-5 pt-5">
                Sản phẩm bán chạy
              </h2>
              <BestSellingProduct />
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
