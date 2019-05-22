const translations = {
    'en': {
        'login'           : 'Login with',
        'createQuiz'      : 'Create Quiz',
        'savedQuiz'       : 'Saved Quizzes',
        'savedPlaylist'   : 'Saved Playlists',
    },
    'es': {
        'login'           : 'Logga in med',
        'createQuiz'      : 'Skapa Frågesport',
        'savedQuiz'       : 'Sparade frågesporter',
        'savedPlaylist'   : 'Saved Playlists',
    }
}

const getTranslation = (lang, text) => {
    return translations[lang][text];
}
  
const allLanguages = [
    { code: 'en', name: 'English'},
    { code: 'sv', name: 'Svenska'}
]
  
const languages = (state = 'en', action) => {
    switch (action.type) {
    case 'CHANGE_LANGUAGE':
        return action.language;
    default:
        return state;
    }
};
  
const { createStore } = Redux;
const store = createStore(languages);
  
const LanguageSelector = () => {
    const options = allLanguages.map(language => {
    return <option value={language.code}>{language.name}</option>
    });

    return (
    <select 
        onChange={(e) => {
        store.dispatch({
            type: 'CHANGE_LANGUAGE',
            language: e.target.value
        })
        }}
    >
        {options}
    </select>
    );
}
  
class LanguageSwitcher extends React.Component {

    componentDidMount() {
        store.subscribe(() => this.forceUpdate());
    }
    
    render () {
        return (
            <div>
            <p>
                {getTranslation(
                store.getState(), 
                'text1'
                )}
            </p>
            <LanguageSelector />
            </div>
        );
    }
};

ReactDOM.render(
    <LanguageSwitcher />, 
    document.getElementById('root')
)

// TESTS
const testChangeLanguage = () => {

    const stateBefore = 'en';

    const action = {
        type: 'CHANGE_LANGUAGE',
        language: 'es'
    }

    const stateAfter = 'es';

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
    languages(stateBefore, action)
    ).toEqual(stateAfter);
};

try {
    testChangeLanguage();
    console.log('All tests passed!');
} catch (e) {
    console.error(e);
}