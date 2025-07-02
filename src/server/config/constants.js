import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config({ path: process.argv[2] === 'dev' ? '.env.dev' : '.env' });

// ESM 환경에서 __dirname 재정의
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// front 뷰 폴더의 절대경로
export const VIEW_ROOT = path.resolve(__dirname, '..', '..', 'front', 'view');
// HTML 절대경로
export const INDEX = path.resolve(__dirname, '..', '..', 'front', 'index.html');
// public 정적 리소스 폴더 경로
export const PUBLIC_DIR = path.join(VIEW_ROOT, '..', 'public');

// 게이트웨이 prefix
export const GATEWAY_PREFIX = 'wg';
// 서버 포트
export const PORT = process.env.PORT;;