// https://cdn.pixabay.com/photo/2016/04/15/11/43/hotel-1330834_1280.jpg
// https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg
// https://cdn.pixabay.com/photo/2021/12/18/06/00/room-6878004_1280.jpg

export default function About() {
    return (
        <main>
            <h1 className="text-3xl font-bold underline">About</h1>
            <p>About this webpage.</p>
            <div className="flex flex-row pt-4 space-x-4">
                <div>
                    <img className="h-36" src="https://cdn.pixabay.com/photo/2016/04/15/11/43/hotel-1330834_1280.jpg" alt="Image of a hotel room with single bed" />
                    <p>
                        Image by <a href="https://pixabay.com/users/davidlee770924-1802090/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1330834">ming dai</a> 
                        <br/>from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=1330834">Pixabay</a>
                    </p>
                </div>
                <div>
                    <img className="h-36" src="https://cdn.pixabay.com/photo/2020/10/18/09/16/bedroom-5664221_1280.jpg" alt="Image of a hotel room with larger size bed" />
                    <p>
                        Image by <a href="https://pixabay.com/users/peterweideman-18753209/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5664221">Peter Weideman</a> 
                        <br/>from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=5664221">Pixabay</a>
                    </p>
                </div>
                <div>
                    <img className="h-36" src="https://cdn.pixabay.com/photo/2021/12/18/06/00/room-6878004_1280.jpg" alt="Image of a hotel room with space for a family" />
                    <p>
                        Image by <a href="https://pixabay.com/users/tianya1223-4833799/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6878004">THAM YUAN YUAN</a> 
                        <br/>from <a href="https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=6878004">Pixabay</a>
                    </p> 
                </div>
                <p>Favicon by <a href="https://www.svgrepo.com" target="_blank">SVG Repo</a></p>
            </div>
        </main>
    );
}