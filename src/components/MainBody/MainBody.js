import styles from "./MainBody.module.css";

function MainBody({children}) {
  return (
   
      <div className={styles.MainBody}>
        
        {children}

      </div>

  );
}

export default MainBody;
