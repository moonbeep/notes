import { MARKER_REGEX, SEPARATOR_LENGTH } from '$lib/constants';

export const toggleTodo = (
	content: string,
	cursorPos: number,
	marker: '[ ] ' | '[#] '
): { content: string; cursorPos: number } => {
	const lineStart: number = content.lastIndexOf('\n', cursorPos - 1) + 1;
	const restOfLine: string = content.slice(lineStart);
	const firstNonSpace: number = lineStart + restOfLine.match(/^ */)![0].length;
	let lineContent: string = content.slice(firstNonSpace);
	let delta: number = 0;

	if (MARKER_REGEX.test(lineContent)) {
		const oldMarker = lineContent.match(MARKER_REGEX)![0];
		lineContent = lineContent.replace(MARKER_REGEX, marker);
		delta = marker.length - oldMarker.length;
	} else {
		lineContent = marker + lineContent;
		delta = marker.length;
	}

	return {
		content: content.slice(0, firstNonSpace) + lineContent,
		cursorPos: cursorPos + delta
	};
};

export const setLineSeparator = (
	content: string,
	cursorPos: number
): { content: string; cursorPos: number } => {
	const lineStart: number = content.lastIndexOf('\n', cursorPos - 1) + 1;
	const lineContent: string = content.slice(lineStart);

	return {
		content: content.slice(0, lineStart) + '-'.repeat(SEPARATOR_LENGTH) + '\n' + lineContent,
		cursorPos: cursorPos + SEPARATOR_LENGTH + 1
	};
};
