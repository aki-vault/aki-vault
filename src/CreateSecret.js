import {
  RadioGroup, Switch, Dialog, Transition,
} from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { CheckIcon, ClipboardCopyIcon } from '@heroicons/react/outline';
import { encryptMessage, postSecret, randomString } from './lib/secret';

export default function CreateSecret() {
  const times = [
    { key: 'Une heure', value: 3600 },
    { key: 'Une journée', value: 86400 },
    { key: 'Une semaine', value: 604800 },
  ];

  const [errors, setErrors] = useState();
  const [plan, setPlan] = useState(3600);
  const [oneTime, setOneTime] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const [encryptedUri, setEncryptedUri] = useState('https://');
  const [phrase, setPhrase] = useState('');

  const submitForm = async () => {
    setProcessing(true);

    try {
      const pw = randomString();

      const { data } = await postSecret({
        expiration: plan,
        message: await encryptMessage(phrase, pw),
        one_time: oneTime,
      });

      const baseUrl = `${window.location.protocol}//${window.location.host}/#/s`;

      setEncryptedUri(`${baseUrl}/${data.message}/${pw}`);

      setIsOpen(true);
      setProcessing(false);
      setPhrase('');
    } catch (e) {
      setErrors('Une erreur est survenue lors de la création du message sécurisé.');
    }
  };

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={setIsOpen}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
            </Transition.Child>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="flex items-center justify-center w-12 h-12 mx-auto bg-green-100 rounded-full">
                    <CheckIcon
                      className="w-6 h-6 text-green-600"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Encryption terminée
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Vous pouvez fournir le lien ci-dessous à votre
                        correspondant.
                      </p>
                    </div>
                    <div className="flex items-stretch mt-2">
                      <button
                        className="flex items-center justify-center w-10 h-10 bg-green-200"
                        type="button"
                        onClick={() => copyToClipboard(encryptedUri)}
                      >
                        <ClipboardCopyIcon
                          className="w-6 h-6 text-green-600"
                          aria-hidden="true"
                        />
                      </button>
                      <input
                        className="flex-1 w-full text-sm border-green-200 outline-none focus:ring-0 focus:border-green-200 active:outline-none"
                        type="text"
                        readOnly
                        value={encryptedUri}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-yellow-600 border border-transparent rounded-md shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Retour sur Vault
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="flex items-center justify-center w-full h-screen">
        <div className="w-full max-w-lg mx-auto">
          <div className="flex items-center justify-center mb-10">
            <svg
              height="60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 218 210"
            >
              <g fill="none" fillRule="evenodd">
                <g stroke="#EA8D72" strokeLinecap="round" strokeWidth="10">
                  <path d="M52 140l120-70M111.689 35.538l.621 138.923M51.69 70.538l120.621 68.923" />
                </g>
                <g fill="#EA8D72" transform="translate(26 30)">
                  <circle cx="169" cy="75" r="3" />
                  <circle cx="127" cy="147" r="3" />
                  <circle cx="45" cy="147" r="3" />
                  <circle cx="3" cy="75" r="3" />
                  <circle cx="45" cy="3" r="3" />
                  <circle cx="127" cy="4" r="3" />
                </g>
                <path
                  fill="#EA8D72"
                  fillRule="nonzero"
                  d="M112 0C54.01 0 7 47.01 7 105s47.01 105 105 105 105-47.01 105-105S169.99 0 112 0zm0 10c52.467 0 95 42.533 95 95s-42.533 95-95 95-95-42.533-95-95 42.533-95 95-95z"
                />
                <g stroke="#EA8D72" strokeLinecap="round" strokeWidth="10">
                  <path d="M5.5 85.5h19M5.5 128.5h19" />
                </g>
                <path
                  fill="#FFF"
                  fillRule="nonzero"
                  d="M112 72c18.225 0 33 14.775 33 33s-14.775 33-33 33-33-14.775-33-33 14.775-33 33-33z"
                />
                <path
                  fill="#EA8D72"
                  fillRule="nonzero"
                  d="M112 62c-23.748 0-43 19.252-43 43s19.252 43 43 43 43-19.252 43-43-19.252-43-43-43zm0 10c18.225 0 33 14.775 33 33s-14.775 33-33 33-33-14.775-33-33 14.775-33 33-33z"
                />
              </g>
            </svg>
            <div className="text-7xl font-extralight text-yellow-500">VAULT</div>
          </div>
          {errors && (
          <div className="px-4 py-2 mb-4 text-sm text-white bg-red-400 rounded-md">
            {errors}
          </div>
          )}
          <div>
            <div className="mt-1">
              <textarea
                id="password"
                rows={5}
                className="bg-gray-50 shadow-sm focus:ring-yellow-500 focus:border-yellow-500 block w-full sm:text-sm border-2 border-gray-400 rounded-md"
                placeholder="Message ou mot de passe que vous désirez encrypter"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            Pendant combien de temps ?
            <RadioGroup
              className="grid grid-cols-3 mt-1"
              value={plan}
              onChange={setPlan}
            >
              {times
              && times.map((time) => (
                <RadioGroup.Option
                  key={time.value}
                  className="flex items-center text-gray-600 outline-none cursor-pointer"
                  value={time.value}
                >
                  {({ checked }) => (
                    <>
                      <div
                        className={`w-4 h-4 mr-2 ring-2 ring-yellow-500 rounded-full border-2 border-white ${
                          checked ? 'bg-yellow-500' : ''
                        }`}
                      />
                      {time.key}
                    </>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
          </div>

          <div className="mt-6">
            <Switch.Group>
              <div className="flex items-center">
                <Switch.Label className="mr-4">Usage unique</Switch.Label>
                <Switch
                  checked={oneTime}
                  onChange={() => setOneTime((r) => !r)}
                  className={`${
                    oneTime ? 'bg-yellow-500' : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea8d72]`}
                >
                  <span
                    className={`${
                      oneTime ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </div>

          <div className="mt-6">
            <button
              className="w-full rounded-full bg-yellow-500 text-white py-3 relative disabled:opacity-40"
              type="button"
              disabled={processing}
              onClick={submitForm}
            >
              {!processing && <>Partager</>}
              {processing && (
              <span className="bg-yellow-500 text-white">
                Chargement en cours...
              </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
