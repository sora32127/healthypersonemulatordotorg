import { useState } from 'react';

interface Tag {
    tagName: string;
    count: number;
}

interface TagSelectionBoxProps {
    onTagsSelected: (tags: string[]) => void;
    parentComponentStateValues: string[];
    allTagsOnlyForSearch: Tag[];
}

const TagSelectionBox = ({
    onTagsSelected,
    parentComponentStateValues,
    allTagsOnlyForSearch,
}: TagSelectionBoxProps): JSX.Element => {
    const [searchText, setSearchText] = useState('');
    const [sortBy, setSortBy] = useState<'count' | 'name'>('count');


    const handleTagClick = (tagName: string) => {
        if (parentComponentStateValues.includes(tagName)) {
            onTagsSelected(parentComponentStateValues.filter(tag => tag !== tagName));
        } else {
            onTagsSelected([...parentComponentStateValues, tagName]);
        }
    };

    const handleRemoveSelectedTag = (tagName: string) => {
        onTagsSelected(parentComponentStateValues.filter(tag => tag !== tagName));
    };

    const filteredTags = allTagsOnlyForSearch
        .filter(tag => tag.tagName.includes(searchText))
        .sort((a, b) => {
            if (sortBy === 'count') {
                return b.count - a.count;
            } else {
                return a.tagName.localeCompare(b.tagName, 'ja');
            }
        });

    return (
        <div className="mb-8">
            <p className="mb-4">タグを選択してください</p>
            <input
                type="text"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                placeholder="タグを検索..."
                className="input input-bordered w-full px-3 py-2 placeholder-slate-500  mb-4"
            />
            <div className="flex space-x-2 mb-4">
                <button
                    type="button"
                    className={`px-4 py-2 btn border-none ${
                        sortBy === 'count'
                            ? 'btn-secondary outline outline-info'
                            : 'btn-secondary'
                    }`}
                    onClick={() => setSortBy('count')}
                >
                    タグ数順で並び替え
                </button>
                <button
                    type="button"
                    className={`px-4 py-2 btn border-none  ${
                        sortBy === 'name'
                            ? 'btn-secondary outline outline-info'
                            : 'btn-secondary'
                    }`}
                    onClick={() => setSortBy('name')}
                >
                    五十音順で並び替え
                </button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredTags.map(tag => (
            <button
                key={`${tag.tagName}-${tag.count}`}
                className={`px-4 py-2 rounded-lg cursor-pointer btn ${
                parentComponentStateValues.includes(tag.tagName)
                    ? 'btn-active'
                    : 'text-gray-700 bg-gray-200'
                }`}
                onClick={() => handleTagClick(tag.tagName)}
                type="button"
            >
                {tag.tagName} ({tag.count})
            </button>
            ))}
            </div>
            <div className="mt-4">
                <p className="mb-2">選択したタグ:</p>
                <div className="flex flex-wrap">
                {parentComponentStateValues.map(tag => (
                    <button
                        key={tag}
                        className="inline-flex items-center px-2 py-1 mr-2 mb-2 text-sm font-medium btn-active rounded-full cursor-pointer"
                        onClick={() => handleRemoveSelectedTag(tag)}
                        type="button"
                    >
                        {tag}
                        <svg
                        className="w-4 h-4 ml-1"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                        </svg>
                    </button>
                ))}
                </div>
            </div>
        </div>
    );
};

export default TagSelectionBox;
