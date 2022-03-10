import { useQuery } from "react-query";

const getToken = async (teaken: string, user_id: number) => {
  const response = await fetch(
    `https://server.cuppazee.app/auth/get/v2?teaken=${encodeURIComponent(
      teaken
    )}&user_id=${encodeURIComponent(user_id)}`
  );
  return await response.json();
};

export default function useToken(user_id?: number) {
  const data = useQuery(["token"], () =>
    getToken("no", 125914)
  );
  return {
    status: data.data?.executed_in
      ? data.data?.data?.access_token
        ? "valid"
        : "expired"
      : data.isLoading
      ? "loading"
      : "failed",
    user_id: 125914,
    token: data.data?.data,
  };
}
