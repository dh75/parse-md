import { useCallback, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';

type ImageMap = Map<string, string>;

export default function App() {
	const [markdownText, setMarkdownText] = useState<string>('');
	const [imageMap, setImageMap] = useState<ImageMap>(new Map());
	const [fileName, setFileName] = useState<string>('');
	const dropRef = useRef<HTMLDivElement | null>(null);

	const onFile = useCallback(async (file: File) => {
		setFileName(file.name);
		setMarkdownText(await file.text());
	}, []);

	const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) onFile(file);
	}, [onFile]);


	const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		const files = Array.from(e.dataTransfer.files || []);
		const mdFile = files.find(f => /\.(md|markdown)$/i.test(f.name));
		if (mdFile) onFile(mdFile);
		const next = new Map(imageMap);
		files.filter(f => /^image\//.test(f.type)).forEach(f => {
			next.set(f.name, URL.createObjectURL(f));
		});
		setImageMap(next);
		dropRef.current?.classList.remove('is-dragover');
	}, [imageMap, onFile]);

	const onDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dropRef.current?.classList.add('is-dragover');
	}, []);

	const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dropRef.current?.classList.remove('is-dragover');
	}, []);

	const components = useMemo(() => ({
		img({ src = '', alt, ...props }: any) {
			const localSrc = imageMap.get(src) || src;
			return <img src={localSrc} alt={alt} {...props} />;
		}
	}), [imageMap]);

	return (
		<div className="container">
			<div className="header">
				<div className="title">Markdown Preview</div>
				<div className="meta">브라우저에서 즉시 렌더링 • 서버 업로드 없음</div>
			</div>

			<div className="filebar">
				<label className="btn btn-primary file-input">
					파일 선택
					<input type="file" accept=".md,.markdown,text/markdown" onChange={onInputChange} />
				</label>
				{fileName ? <span className="meta">{fileName}</span> : <span className="meta">.md 파일을 선택하거나 드롭하세요</span>}
				<a className="btn btn-ghost" href="https://github.com/remarkjs/react-markdown" target="_blank" rel="noreferrer">문서</a>
			</div>

			<div
				ref={dropRef}
				className="dropzone"
				onDragOver={e => e.preventDefault()}
				onDragEnter={onDragEnter}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
			>
				여기에 .md 파일과 이미지(선택)를 드롭하세요
			</div>

			<div className="preview">
				{markdownText ? (
					<ReactMarkdown
						className="md"
						remarkPlugins={[remarkGfm, remarkMath]}
						rehypePlugins={[rehypeKatex as any, rehypeHighlight as any, rehypeSanitize as any]}
						components={components as any}
					>
						{markdownText}
					</ReactMarkdown>
				) : (
					<div className="empty">미리보기 내용이 여기 표시됩니다</div>
				)}
			</div>
		</div>
	);
}


