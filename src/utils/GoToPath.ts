import { useNavigate } from "react-router";

function GoToPath(path: string) {
  const navigate = useNavigate();
  return navigate(path);
}

export default GoToPath;
