# parse-md

브라우저에서만 동작하는 마크다운 미리보기 앱.

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
npm run preview
```

## 기능

- 파일 업로드/드래그앤드롭으로 `.md` 읽기
- `react-markdown` + `remark/rehype` 플러그인
- 코드 하이라이팅, 수식(KaTeX), sanitize 기본 보안
- 이미지 파일을 같이 드롭하면 `![alt](image.png)` 참조 자동 매핑

데이터는 서버로 업로드되지 않습니다.
