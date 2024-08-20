import { Skeleton, Table, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

export const Reviews = () => {
  const [loading, setLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/v1/book-reviews");
        setReviews(data.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setColumns([
      {
        title: "Review Title",
        dataIndex: "reviewId",
        key: "reviewId",
        render: (_: any, { reviewId }: { reviewId: any }) => <p>{reviewId.title}</p>,
      },
      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        render: (_: any, { rating }: { rating: number }) => (
          <Tag color={rating > 3 ? "green" : "red"}>{rating}</Tag>
        ),
      },
      {
        title: "Review",
        dataIndex: "reviewText",
        key: "reviewText",
      },
      {
        title: "Created At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_: any, { createdAt }: { createdAt: string }) => (
          <p>{new Date(createdAt).toDateString()}</p>
        ),
      },
      {
        title: "Reviewer",
        dataIndex: "reviewer",
        key: "reviewer",
      },
    ]);

    setDataSource(
      reviews.map((review) => ({
        key: review._id,
        ...review,
      }))
    );
  }, [reviews]);

  return (
    <div>
      <h1>Reviews</h1>
      <div>
        {loading ? (
          <Skeleton loading={loading} />
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            bordered
          />
        )}
      </div>
    </div>
  );
};
