import { Link } from 'react-router-dom';
import './page403.css';

interface Props {
    role?: 'student' | 'teacher' | 'admin' | 'superAdmin';
}
export default function _403({ role }: Props ) {
  return (
    <div className="flex-container">
      <div className="text-center">
        <h1>
          <span className="fade-in" id="digit1">
            4
          </span>
          <span className="fade-in" id="digit2">
            0
          </span>
          <span className="fade-in" id="digit3">
            3
          </span>
        </h1>
        <h3 className="fadeIn">PAGE IS FORBIDDEN </h3>
        <Link to={'/'}>
          <button type="button" name="button">
            Return To Home
          </button>
        </Link>
      </div>
    </div>
  );
}
