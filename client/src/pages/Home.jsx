import Banner from "../components/Banner";
import TabCategories from "../components/TabCategories";

const Home = () => {
  return (
    <section>
      <div className="pb-7 w-11/12 mx-auto">
        <Banner></Banner>
        <TabCategories></TabCategories>
      </div>
    </section>
  );
};

export default Home;
