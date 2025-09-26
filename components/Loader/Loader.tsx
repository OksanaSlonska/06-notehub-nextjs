import css from "./Loader.module.css";

const Loader: React.FC = () => {
  return (
    <div className={css.loaderWrapper}>
      <div className={css.spinner}></div>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default Loader;
