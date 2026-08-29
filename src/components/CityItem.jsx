// import styles from "./CityItem.module.css";

// const formatDate = (date) =>
//   new Intl.DateTimeFormat("en", {
//     day: "numeric",
//     month: "long",
//     year: "numeric",
//   }).format(new Date(date));

// function CityItem({ city }) {
//   const { cityName, emoji, date } = city;

//   return (
//     <li className={styles.cityItem}>
//       <span className={styles.emoji}>{emoji}</span>
//       <h3 className={styles.name}>{cityName}</h3>
//       <time className={styles.date}>{formatDate(date)}</time>
//       <button className={styles.deleteBtn}>&times;</button>
//     </li>
//   );
// }

// export default CityItem;

import styles from "./CityItem.module.css";

// Converts emoji flags such as 🇵🇹 into country codes such as "pt"
function emojiToCountryCode(emojiString) {
  if (!emojiString) return "";

  return [...emojiString]
    .map((char) => {
      const code = char.codePointAt(0);

      // Regional indicator symbols: A-Z
      if (code >= 127462 && code <= 127487) {
        return String.fromCharCode(code - 127462 + 65);
      }

      return "";
    })
    .join("")
    .toLowerCase();
}

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { cityName, emoji, date } = city;

  // Convert 🇵🇹 → pt
  const countryCode = emojiToCountryCode(emoji);

  return (
    <li className={styles.cityItem}>
      <span className={styles.emojiContainer}>
        {countryCode ? (
          <img
            src={`https://flagcdn.com/w40/${countryCode}.png`}
            srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
            width={24}
            height={18}
            alt={`${cityName} flag`}
            className={styles.flagImg}
          />
        ) : (
          <span className={styles.emoji}>❓</span>
        )}
      </span>

      <h3 className={styles.name}>{cityName}</h3>

      <time className={styles.date}>{formatDate(date)}</time>

      <button className={styles.deleteBtn}>&times;</button>
    </li>
  );
}

export default CityItem;
