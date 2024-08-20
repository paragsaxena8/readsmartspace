import "./ThreeDBook.scss";

export function ThreeDBook({
  bookName,
  featureImage,
}: {
  bookName: string;
  featureImage: string;
}) {
  const bookTitle = bookName ? bookName : " ";
  const bookURL = featureImage
    ? featureImage
    : `https://ik.imagekit.io/dev0Xd/book?tr=w-1410,h-2500,l-text,i-${bookTitle},fs-90,co-000000,l-end`;
  return (
    <>
      <a
        className="book-container"
        href=""
        target="_blank"
        rel="noreferrer noopener"
      >
        <div className="book">
          <img src={bookURL} alt={bookName} />
        </div>
      </a>
    </>
  );
}
